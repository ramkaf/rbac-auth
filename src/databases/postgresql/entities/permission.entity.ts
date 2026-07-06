import { PrimaryGeneratedColumn, Column, ManyToMany, Entity } from "typeorm";
import { Role } from "./role.entity";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ default: null, type: "varchar" })
  category: string;

  @Column()
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
