#!/usr/bin/env node
import { Command } from "commander";
import {
  DateProvider,
  PostMessageCommand,
  PostMessageUseCase,
} from "./src/post-message.usecase";
import { InMemoryMessageRepository } from "./src/message.inmemory.repository";
import { FileSystemMessageRepository } from "./src/message.fs.repository";
import { ViewTimelineUseCase } from "./src/view-timeline.usecase";
import {
  EditMessageCommand,
  EditMessageUseCase,
} from "./src/edit-message.usecase";

class RealDateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}

const messageRepository = new FileSystemMessageRepository();
const dateProvider = new RealDateProvider();
const postMessageUseCase = new PostMessageUseCase(
  messageRepository,
  dateProvider
);
const viewTimeLineUseCase = new ViewTimelineUseCase(
  messageRepository,
  dateProvider
);

const editMessageUseCase = new EditMessageUseCase(messageRepository);

const program = new Command();

program
  .version("1.0.0")
  .description("Crafty social network")
  .addCommand(
    new Command("post")
      .argument("<user>", "the current user")
      .argument("<message>", "the message to poste")
      .action(async (user, message) => {
        const postMessageCommand: PostMessageCommand = {
          id: `${Math.floor(Math.random() * 1000000)}`,
          text: message,
          author: user,
        };
        try {
          await postMessageUseCase.handle(postMessageCommand);
          console.log("Message posted");
          process.exit(0);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command("edit")
      .argument("<message-id>", "the message id of the message to edit")
      .argument("<text-message>", "the new text")
      .action(async (messageId, message) => {
        const editMessageCommand: EditMessageCommand = {
          messageId,
          text: message,
        };
        try {
          await editMessageUseCase.handle(editMessageCommand);
          console.log("Message edited");
          process.exit(0);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command("view")
      .argument("<user>", "the user to view the timeline of")
      .action(async (user) => {
        try {
          const timeline = await viewTimeLineUseCase.handle({ user });
          console.table(timeline);
          process.exit(0);
        } catch (error) {
          console.error(error);
          process.exit(1);
        }
      })
  );

async function main() {
  await program.parseAsync();
}

main();
