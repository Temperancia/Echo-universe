export class Trust {
  id: number;
  name: string;
  description: string;
  owner: string;
  members: string[];
  createdOn: string;
  reputation: number;
  constructor(id, name, description, owner, members, createdOn, reputation) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.owner = owner;
    this.members = members;
    this.createdOn = createdOn;
    this.reputation = reputation;
  }
}
