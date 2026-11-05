import { IsBoolean, IsDateString, IsIn, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export const RATINGS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export class CreateLogDto {
  @IsInt()
  tmdbId: number;

  @IsDateString()
  watchedDate: string;

  @IsOptional()
  @IsIn(RATINGS, { message: 'rating has to be between 0.5 and 5 in half steps' })
  rating?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  review?: string;

  @IsOptional()
  @IsBoolean()
  liked?: boolean;

  @IsOptional()
  @IsBoolean()
  rewatch?: boolean;
}
