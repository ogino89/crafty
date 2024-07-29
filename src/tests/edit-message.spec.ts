import { EmptyMessageError, MessageTooLongError } from "../message";
import { messageBuilder } from "./message.builder";
import { MessagingFixture, createMessagingFixture } from "./messaging.fixture";

describe("Feature: editing a message", () => {
  let fixture: MessagingFixture;

  beforeEach(() => {
    fixture = createMessagingFixture();
  });
  describe("Rule: The editing text should not be super than 280 characters", () => {
    it("Alice can edit her message to a text inferior to 280 characters", async () => {
      const aliceMessageBuilder = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hello Wrld");

      fixture.givenTheFollowingMessagesExist([aliceMessageBuilder.build()]);

      await fixture.whenUserEditsMessage({
        messageId: "message-id",
        text: "Hello World",
      });

      await fixture.thenMessageShouldBe(
        aliceMessageBuilder.withText("Hello World").build()
      );
    });

    it("Alice cannot edit her message to a text superior to 280 characters", async () => {
      const textWithLengthOf281 =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mauris lacus, fringilla eu est vitae, varius viverra nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus suscipit feugiat sollicitudin. Aliquam erat volutpat amet.";
      const originalAliceMessage = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hello World")
        .build();

      fixture.givenTheFollowingMessagesExist([originalAliceMessage]);

      await fixture.whenUserEditsMessage({
        messageId: "message-id",
        text: textWithLengthOf281,
      });

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(MessageTooLongError);
    });

    it("Alice cannot edit her message to an empty text", async () => {
      const originalAliceMessage = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hello Wrld")
        .build();

      fixture.givenTheFollowingMessagesExist([originalAliceMessage]);

      await fixture.whenUserEditsMessage({
        messageId: "message-id",
        text: "",
      });

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    it("Alice cannot edit her message with only whitespaces", async () => {
      const originalAliceMessage = messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hello Wrld")
        .build();

      fixture.givenTheFollowingMessagesExist([originalAliceMessage]);

      await fixture.whenUserEditsMessage({
        messageId: "message-id",
        text: "    ",
      });

      await fixture.thenMessageShouldBe(originalAliceMessage);
      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});
