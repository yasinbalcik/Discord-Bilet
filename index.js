const Discord = require('discord.js');
const client = new Discord.Client();
const {renk, token, prefix, yetkili} = require('./ayar.json');

client.on('ready', () => {
  console.log(`Hazır!`);
});

client.on('message', async (message) => {

  if (message.content ===  prefix + 'bilet') {
    message.delete();
    const kanal = await message.guild.channels.create(`bilet-${message.author.username}`)//bilet-kullanıadı şeklinde bir kanal oluşturur

    kanal.updateOverwrite(message.guild.id, {'SEND_MESSAGES': false, 'VIEW_CHANNEL': false});// Everyone Rolü için mesaj göndermeyi ve kanalı görmeyi kapatır.
    kanal.updateOverwrite(yetkili, {'SEND_MESSAGES': true, 'VIEW_CHANNEL': true});// Ayar dosyasındaki yetkili için mesaj göndermeyi ve kanalı görmeyi kapatır.
    kanal.updateOverwrite(message.author, {'SEND_MESSAGES': true, 'VIEW_CHANNEL': true});//Mesaj göndermeyi ve kanalı görmeyi kullanıcı için açık yapar.
  
    const biletMesajı = new Discord.MessageEmbed()
      .setColor(renk)//Ayar dosyamız'dan çektiğimiz renk değişkeni.
      .setAuthor('Desteğe hoş geldiniz!')//Bilgilendirme mesajı
      .setDescription(`Sayın, <@${message.author.id}>\nDestek ekibimizle iletişime geçtiğiniz için teşekkür edebilir misiniz? Size en kısa sürede ulaşacağız! \n İşleminiz bittiğinde bu kanalı kapatmak için alt'aki 🔐 emojisine tıklayın`)//Açılan bilet kanalında otomatik olarak bilgilendirme mesajı olarak bu metni atar.
      .setTimestamp()//Zaman damgasını embed'e atar.
      .setFooter(`© 2020-2021 ${client.user.username}`, client.user.avatarURL())//"© 2020-2021 Bot ismi" şeklinde mesaj sonunda gösterilir.
    kanal.send(biletMesajı)
    .then(
        emojiEkle => {
          emojiEkle.react("🔐");
          const filter = (reaction, user) => {
            return ( ["🔐"].includes(reaction.emoji.name) && user.id === message.author.id );
          };
        emojiEkle
        .awaitReactions(filter, { max: 1 }).catch(hata => console.log(""))
        .then(collected => { const reaction = collected.first();

        if (reaction.emoji.name === "🔐") {
          emojiEkle.delete();
          kanal.delete();
        }
        })
        .catch(collected => {
          emojiEkle.delete().catch(hata => console.log(""));;
        });
    }).catch(hata => console.log(""));;
  
    const anaMesaj = new Discord.MessageEmbed()
      .setColor(renk)//Ayar dosyamız'dan çektiğimiz renk değişkeni.
      .setAuthor('En kısa sürede size ulaşacağız!')//Bilgilendirme mesajı
      .setDescription(`<#${kanal.id}>`)//Açılan kanalını etiketler.
      .setTimestamp()//Zaman damgasını embed'e atar.
      .setFooter(`© 2020-2021 ${client.user.username}`, client.user.avatarURL())//"© 2020-2021 Bot ismi" şeklinde mesaj sonunda gösterilir.
    message.channel.send(anaMesaj).then(msg => msg.delete( { timeout: 15000 } )).catch(hata => console.log(""));//Bilgilendirme mesajı eğer bir yetkili tarafından manuel şekilde silinirse Bot konsoluna bilgilendirme mesajı veriyor.
  }

});

client.login(token);
