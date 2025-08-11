import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'matches' })
@Index('idx_matches_language_created_at', ['language', 'created_at'])
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user_a!: string;

  @Column('uuid')
  user_b!: string;

  @Column({ type: 'text' })
  language!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  closed_at!: Date | null;
}
