import * as fs from "fs";
import * as path from "path";
import { MessageRepository } from "./message.repository";
import { Message } from "./message";

export class FileSystemMessageRepository implements MessageRepository {
  async getById(id: string): Promise<Message> {
    const messages = await this.getMessages();

    return messages.filter((m) => m.id === id)[0];
  }
  private readonly messagePath = path.join(__dirname, "messages.json");

  async save(message: Message): Promise<void> {
    const messages = await this.getMessages();
    const existingMessageIndex = messages.findIndex((m) => m.id === message.id);
    if (existingMessageIndex === -1) {
      messages.push(message);
    } else {
      messages[existingMessageIndex] = message;
    }
    return fs.promises.writeFile(this.messagePath, JSON.stringify(messages));
  }

  private async getMessages(): Promise<Message[]> {
    const data = await fs.promises.readFile(this.messagePath, "utf-8");
    const messages = JSON.parse(data.toString()) as Message[];

    return messages.map((m) => ({
      id: m.id,
      author: m.author,
      text: m.text,
      publishedAt: new Date(m.publishedAt),
    }));
  }

  async getAllOfUser(user: string): Promise<Message[]> {
    const messages = await this.getMessages();
    return messages.filter((m) => m.author === user);
  }
}
