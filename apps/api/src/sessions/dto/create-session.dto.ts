import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @MinLength(10)
  problemText: string;

  @IsOptional()
  @IsUrl()
  sourceUrl?: string;
}
