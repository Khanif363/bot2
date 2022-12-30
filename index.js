const { Telegraf } = require("telegraf");
const randomString = require("random-string");

// Replace YOUR_API_KEY with your actual API Key
const API_KEY = "5818810312:AAFmP5gobbXbsWkOSilZJhDuJk7J_ElPyWE";

// Create new bot
const bot = new Telegraf(API_KEY);

// Generate random username for partner
const findPartner = (userId) => {
  // Find another user who is also looking for a partner
  const partner = lookingUsers.find((u) => u.id !== userId);

  // Return partner's username
  return partner ? partner.username : null;
};

// Add command to start anonymous chat
bot.command("start_anonymous_chat", (ctx) => {
  // Generate random username
  const username = randomString({ length: 10 });

  // Send message to user with instructions to start anonymous chat
  ctx.reply(
    `Hi! Your username for this anonymous chat is "${username}". To start chatting with someone, type "/find_partner".`
  );
});

// Add command to search for partner
bot.command("find_partner", (ctx) => {
  // Find another user who is also looking for a partner
  const partnerUsername = findPartner();

  // If no partner is found, send message to user
  if (!partnerUsername) {
    ctx.reply("No partner found. Please try again later.");
    return;
  }

  partnerId = lookingUsers.find((u) => u.username === partnerUsername).id ?? null;
  // Send message to both users with each other's username
  ctx.reply(
    `You have been matched with ${partnerUsername}. Start chatting now!`
  );
  ctx.telegram.sendMessage(
    partnerId,
    `You have been matched with ${ctx.from.username}. Start chatting now!`
  );
});

bot.on("message", (ctx) => {
  // Check if message is from partner
  if (ctx.from.id === partnerId) {
    // Send message from partner to user
    ctx.telegram.sendMessage(ctx.from.id, ctx.message.text);
  }
});

// Add command to send file
bot.command("send_file", (ctx) => {
  // Request file from user
  ctx.reply("Please send the file you want to send to your partner.", {
    reply_markup: {
      force_reply: true,
    },
  });

  // Add command to end chat
  bot.command("end_chat", (ctx) => {
    // Send message to both users that the chat has ended
    ctx.reply("The anonymous chat has ended.");
    ctx.telegram.sendMessage(partnerId, "The anonymous chat has ended.");
  });
  // When user sends a file, send it to the partner
  bot.on("document", (ctx) => {
    ctx.telegram.sendDocument(partnerId, ctx.message.document);
  });
});

// Add command to search for another user
bot.command("search_another_user", (ctx) => {
  // Send message to user with instructions to search for another user
  ctx.reply('To search for another user, type "/find_partner".');
});

// Launch bot
bot.launch();
