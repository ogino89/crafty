import {
  EditMessageCommand,
  EditMessageUseCase,
} from "../edit-message.usecase";
import { Message } from "../message";
import { InMemoryMessageRepository } from "../message.inmemory.repository";
import {
  PostMessageCommand,
  PostMessageUseCase,
} from "../post-message.usecase";
import { StubDateProvider } from "../stub-date-provider";
import { ViewTimelineUseCase } from "../view-timeline.usecase";

export const createMessagingFixture = () => {
  let timeline: {
    author: string;
    text: string;
    publicationTime: string;
  }[];
  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();
  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );
  const viewTimelineUseCase = new ViewTimelineUseCase(
    messageRepository,
    dateProvider
  );
  const editMessageUseCase = new EditMessageUseCase(messageRepository);
  let thrownError: Error;
  return {
    givenTheFollowingMessagesExist(messages: Message[]) {
      messageRepository.givenExistingMessages(messages);
    },
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    async whenUserPostsAmessage(postMessageCommand: PostMessageCommand) {
      try {
        await postMessageUseCase.handle(postMessageCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    async whenUserEditsMessage(editMessageCommand: EditMessageCommand) {
      try {
        await editMessageUseCase.handle(editMessageCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    async thenMessageShouldBe(expectedMessage: Message) {
      const message = await messageRepository.getById(expectedMessage.id);
      expect(message).toEqual(expectedMessage);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },
    async whenUserSeesTheTimelineOf(user: string) {
      timeline = await viewTimelineUseCase.handle({ user });
    },
    thenUserShouldSee(
      expectedTimeline: {
        author: string;
        text: string;
        publicationTime: string;
      }[]
    ) {
      expect(timeline).toEqual(expectedTimeline);
    },
  };
};

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;
