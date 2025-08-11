import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'citext', unique: true })
  email!: string;

  @Column({ type: 'text' })
  password_hash!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Profile;
}
