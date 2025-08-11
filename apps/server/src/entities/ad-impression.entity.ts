import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'ad_impressions' })
export class AdImpression {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user_id!: string;

  @Column({ type: 'text' })
  placement!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}
