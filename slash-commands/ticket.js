const {
  Client,
  Interaction,
  PermissionFlagsBits,
  CategoryChannel,
} = require("discord.js");

const {
  ActionRow,
  TextInputComponent,
  Modal,
  SlashCommandBuilder,
} = require("@discordjs/builders");

module.exports = {
  run: async ({ interaction, client, handler }) => {
    const modal = new Modal()
      .setCustomId(`modal-${interaction.user.id}`)
      .setTitle("Tạo Ticket");

    const ticketName = new TextInputComponent()
      .setCustomId("ticketName")
      .setLabel("Tên Ticket")
      .setStyle("SHORT");

    const ticketDescription = new TextInputComponent()
      .setCustomId("ticketDescription")
      .setLabel("Mô tả vấn đề")
      .setStyle("PARAGRAPH");

    const row1 = new ActionRow().addComponents(ticketName);
    const row2 = new ActionRow().addComponents(ticketDescription);

    modal.addComponents(row1, row2);

    await interaction.showModal(modal);

    const filter = (interaction) =>
      interaction.customId === `modal-${interaction.user.id}`;

    interaction
      .awaitModalSubmit({ filter, time: 30_000 })
      .then(async (modalInteraction) => {
        const ticketNameValue = modalInteraction.values.get("ticketName");
        const ticketDescriptionValue = modalInteraction.values.get(
          "ticketDescription"
        );

        const categoryId = "1082321763192541285"; // Replace with the ID of your category
        const category = client.channels.cache.get(categoryId);

        if (!(category instanceof CategoryChannel)) {
          console.error("The provided ID is not a valid category.");
          return;
        }

        const newChannel = await interaction.guild.channels.create(
          ticketNameValue,
          {
            type: "GUILD_TEXT",
            parent: category,
          }
        );

        await newChannel.send(
          `${interaction.user}, Ticket đã được tạo.\n\n**Mô tả vấn đề:**\n${ticketDescriptionValue}`
        );

        await modalInteraction.deferUpdate();
        modalInteraction.followUp("Ticket đã được tạo.");
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  },

  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Tạo Ticket."),
};