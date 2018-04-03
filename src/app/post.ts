export class Post {
  id: number;
  name: string;
  content: string;
  createdOn: string;
  reputation: number;
  constructor(id, name, content, createdOn, reputation) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.createdOn = createdOn;
    this.reputation = reputation;
  }
}
