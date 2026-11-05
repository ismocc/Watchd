import { IsBoolean, IsDateString, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { RATINGS } from './create-log.dto';

export class UpdateLogDto {
  @IsOptional()
  @IsDateString()
  watchedDate?: string;

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
