import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'messages' })
@Index('idx_messages_match_created_at', ['match_id', 'created_at'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  match_id!: string;

  @Column('uuid')
  sender_id!: string;

  @Column({ type: 'text' })
  type!: 'text' | 'image' | 'audio';

  @Column({ type: 'text', nullable: true })
  content!: string | null;

  @Column({ type: 'text', nullable: true })
  media_url!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  media_meta!: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  seen_at!: Date | null;
}
