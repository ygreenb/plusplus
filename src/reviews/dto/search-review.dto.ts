import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchReviewDto {
  // 페이지네이션
  @IsOptional()
  page: number;
  @IsOptional()
  take: number;

  // 별점높은순, 별점낮은순
}
