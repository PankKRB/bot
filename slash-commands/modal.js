const {
  Client,
  Interaction,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  run: async ({ interaction, client, handler }) => {
    const requiredRoleId = "1084499650066792559"; // Replace with your role ID

    if (!interaction.member.roles.cache.has(requiredRoleId)) {
      return interaction.reply({
        content: "Bạn không có quyền sử dụng lệnh này.",
        ephemeral: true,
      });
    }
    
    const modal = new ModalBuilder()
      .setCustomId(`modal-${interaction.user.id}`)
      .setTitle("Đơn Đăng Ký CKG CITY");

    const linkFacebook = new TextInputBuilder()
      .setCustomId("linkFacebook")
      .setLabel("Link Facebook.")
      .setStyle(TextInputStyle.Short);

    const mail = new TextInputBuilder()
      .setCustomId("mail")
      .setLabel("Mail Của Bạn.")
      .setStyle(TextInputStyle.Short); //Paragraph

    const mic = new TextInputBuilder()
      .setCustomId("mic")
      .setLabel("Tình Trạng Mic (CÓ / KHÔNG).")
      .setStyle(TextInputStyle.Short);  

    const imageLink = new TextInputBuilder()
      .setCustomId("imageLink")
      .setLabel("Nhập link ảnh")
      .setStyle(TextInputStyle.Short);

    const row1 = new ActionRowBuilder().addComponents(linkFacebook);
    const row2 = new ActionRowBuilder().addComponents(imageLink);
    const row3 = new ActionRowBuilder().addComponents(mail);
    const row4 = new ActionRowBuilder().addComponents(mic);

    modal.addComponents(row1, row2, row3, row4);

    await interaction.showModal(modal);

    const filter = (interaction) =>
      interaction.customId === `modal-${interaction.user.id}`;

    interaction
  .awaitModalSubmit({ filter, time: 30_000 })
  .then(async (modalInteraction) => {
    const linkFacebookValue =
      modalInteraction.fields.getTextInputValue("linkFacebook");
    const mailValue =
      modalInteraction.fields.getTextInputValue("mail");
    const imageLinkValue =
      modalInteraction.fields.getTextInputValue("imageLink");
    const micValue =
      modalInteraction.fields.getTextInputValue("mic");  

    // Tìm các kênh chat dựa trên ID
    const channelId = "1126530047759618118"; // Thay thế bằng ID kênh chat của bạn
    const channel = await client.channels.fetch(channelId);

    // Gửi thông điệp đến kênh chat
    channel.send({
  content: `**Người gửi:** ${interaction.user.tag}\n> Link Facebook: \`\`\`${linkFacebookValue}\`\`\`\n> Gmail: \`\`\`${mailValue}\`\`\`\n> Tình Trạng Mic: \`\`\`${micValue}\`\`\`\n> Avatar:`,
  files: [imageLinkValue],
});

    await modalInteraction.deferUpdate(); // Defer the interaction
    modalInteraction.followUp("Đã Gửi Đơn Đăng Ký.");
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });
  },

  data: new SlashCommandBuilder()
    .setName("nopdon")
    .setDescription("Nộp Đơn Đăng Ký Tham Gia CKG CITY."),
};