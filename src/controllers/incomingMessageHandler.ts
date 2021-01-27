import { Message, MessageReaction, User } from "discord.js";
import { handleAnnouncements } from "../helper/announcement";
import {
  certificateDMHandler,
  getCertificateChannelMessage,
} from "../helper/certificate";
import { handleJokes, handleMemes } from "../helper/jokes";
import { handleShrinkURLMessage } from "../helper/kzillaXYZ";
import { handleGetMemberCount } from "../helper/memberCount";
import { eventSchema } from "../models/event";
import { COMMANDS, CONSTANTS } from "../utils/constants";
import { serverLogger } from "../utils/logger";
import {
  getHelpMessage,
  invalidCommand,
  internalError,
} from "../utils/messages";
import { sendDirectMessageToUser } from "./sendMessageHandler";
/**
 * Handles all incoming commands in channel
 *
 * @param {Message} incomingMessage
 */
export async function handleIncomingChannelCommand(incomingMessage: Message) {
  try {
    const messageCommand = incomingMessage.content.split(" ")[1];

    switch (messageCommand) {
      case COMMANDS.certificate: {
        getCertificateChannelMessage(incomingMessage);
        break;
      }
      case COMMANDS.shrinkURL: {
        handleShrinkURLMessage(incomingMessage);
        break;
      }
      case COMMANDS.membercount: {
        handleGetMemberCount(incomingMessage);
        break;
      }
      case COMMANDS.announce: {
        handleAnnouncements(incomingMessage);
        serverLogger(
          "success",
          incomingMessage.content.split(" ").splice(0, 5),
          "Announcements"
        );
        break;
      }
      case COMMANDS.joke: {
        handleJokes(incomingMessage);
        break;
      }
      case COMMANDS.memes: {
        handleMemes(incomingMessage);
        break;
      }
      case COMMANDS.help: {
        incomingMessage.channel.send(getHelpMessage());
        serverLogger("success", incomingMessage.content, "Help Message");
        break;
      }
      default:
        incomingMessage.channel.send(invalidCommand());
        serverLogger("user-error", incomingMessage.content, "Invalid Command");
        break;
    }
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(internalError());
  }
}

/**
 * Handles all incoming commands in Direct Message
 *
 * @param {Message} incomingMessage
 */
export function handleIncomingDMCommand(incomingMessage: Message) {
  try {
    const messageCommand = incomingMessage.content.split(" ")[1];
    switch (messageCommand) {
      case COMMANDS.shrinkURL: {
        handleShrinkURLMessage(incomingMessage);
        break;
      }
      case COMMANDS.help: {
        incomingMessage.channel.send(getHelpMessage());
        serverLogger("success", incomingMessage.content, "Help Message");
        break;
      }
      default:
        incomingMessage.channel.send(invalidCommand());
        serverLogger("user-error", incomingMessage.content, "Invalid Command");
        break;
    }
  } catch (err) {
    serverLogger("error", incomingMessage.content, err);
    incomingMessage.channel.send(internalError());
  }
}

/**
 * Handles all incoming reaction commands
 *
 * @param {User} user
 * @param {MessageReaction} reaction
 * @param {eventSchema} event
 * @param {Message} message
 */
export async function handleIncomingReaction(
  user: User,
  reaction: MessageReaction,
  event: eventSchema,
  message: Message
) {
  try {
    if (!user.bot) {
      if (reaction.emoji.name === CONSTANTS.thumbsUpEmoji) {
        sendDirectMessageToUser(
          user,
          message,
          event,
          CONSTANTS.certificateUserDirectMessage(event.name)
        );
      }
    }
  } catch (err) {
    serverLogger("error", "InternalError", err);
  }
}
