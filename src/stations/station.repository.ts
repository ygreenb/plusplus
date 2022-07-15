import { EntityRepository, getRepository, Repository } from 'typeorm';
import { ReturnStationsDto } from './dto/return-stations.dto';
import { SearchStataionDto } from './dto/search-station.dto';
import { StationStatus } from './station-status.enum';
import { Station } from './station.entity';
import { StationsController } from './stations.controller';

@EntityRepository(Station)
export class StationRepository extends Repository<Station> {
  async getOne(id: number): Promise<Station> {
    const result = await getRepository(Station)
      .createQueryBuilder('station')
      .leftJoinAndSelect('station.local_id', 'local')
      .leftJoinAndSelect('station.stay_id', 'stay')
      .leftJoinAndSelect('station.themes', 'theme')
      .where('station.id = :id', { id })
      .getOne();
    return result;
  }

  // 숙소 목록 조회(admin 전용, status 필터링)
  async getAll(query: SearchStataionDto): Promise<ReturnStationsDto> {
    const { status, localId, stayIds, themeIds, page, take } = query;

    const result = getRepository(Station)
      .createQueryBuilder('station')
      .leftJoinAndSelect('station.local_id', 'local')
      .leftJoinAndSelect('station.stay_id', 'stay')
      .leftJoinAndSelect('station.themes', 'theme')
      .where('1=1');

    if (status) {
      result.andWhere(`station.status = '${status}'`);
    }

    if (localId) {
      result.andWhere('station.local_id = :localId', { localId });
    }
    if (stayIds) {
      result.andWhere(`station.stay_id IN (${stayIds})`);
    }
    if (themeIds) {
      result.andWhere(`station.tag_id IN (${themeIds})`);
    }
    result.limit(take ?? 5).offset(page ? 5 * (page - 1) : 0);
    console.log(result.getQuery());

    const [stations, count] = await result.getManyAndCount();

    return { count, stations };
  }

  // 숙소 검색 (user 전용, 검색필터링)
  async getBySearch(query: SearchStataionDto): Promise<Station[]> {
    const { localId, stayIds, themeIds, page, take } = query;

    const result = getRepository(Station)
      .createQueryBuilder('station')
      .leftJoinAndSelect('station.local_id', 'local')
      .leftJoinAndSelect('station.stay_id', 'stay')
      .leftJoinAndSelect('station.themes', 'theme')
      .where(`station.status = '${StationStatus.ACTIVE}'`);

    if (localId) {
      result.andWhere('station.local_id = :localId', { localId });
    }
    if (stayIds) {
      result.andWhere(`station.stay_id IN (${stayIds})`);
    }
    if (themeIds) {
      result.andWhere(`station.tag_id IN (${themeIds})`);
    }
    result.limit(take ?? 5).offset(page ? 5 * (page - 1) : 0);
    console.log(result.getQuery());
    return result.getMany();
  }
}