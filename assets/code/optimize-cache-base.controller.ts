import { Get, Header, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AppLoggerService } from '../app-logger/app-logger.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { FindOptionsService } from '../common/find-options/find-options.service';
import { LimitOptionsService } from '../common/limit-options/limit-options.service';
import { EndpointAccessGuard } from '../guards/endpoint-access.guard';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { RequestExtended } from '../interfaces/request-extended.interface';
import { BaseRestrictedService } from './base-restricted-v2.service';
import { BaseService } from './base.service';

@UseGuards(JwtAuthGuard, EndpointAccessGuard)
export class BaseController<
    Entity,
    Service extends BaseService<Entity> | BaseRestrictedService<Entity>,
> {
    private static cache = new Map<string, { data: any; timestamp: number }>();
    private static readonly CACHE_TTL = 60000;

    constructor(
        protected service: Service,
        protected authenticationService: AuthenticationService,
        protected limitOptionsService: LimitOptionsService,
        protected findOptionsService: FindOptionsService,
        protected logger: AppLoggerService,
    ) {}

    private generateCacheKey(type: string, params: any, login: string): string {
        const normalizedParams = typeof params === 'object'
            ? JSON.stringify(params)
            : params;
        return `cache:${this.constructor.name}:${type}:${login}:${normalizedParams}`;
    }

    private getFromCache(key: string): any | null {
        const item = BaseController.cache.get(key);

        if (!item) {
            console.log(`Cache MISS: ${key}`);
            return null;
        }

        if (Date.now() - item.timestamp > BaseController.CACHE_TTL) {
            console.log(`Cache EXPIRED: ${key}`);
            BaseController.cache.delete(key);
            return null;
        }

        console.log(`Cache HIT: ${key}`);
        return item.data;
    }

    private setToCache(key: string, data: any): void {
        console.log(`Cache SET: ${key}`);
        BaseController.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    @Get()
    @Header('content-type', 'application/json')
    async getList(@Query() query: any, @Req() request: RequestExtended): Promise<object> {
        const login = this.authenticationService.getLogin(request);
        this.logger.access(`${this.constructor.name}.getList ${login}`);

        const cacheKey = this.generateCacheKey('list', query, login);

        const cachedResult = this.getFromCache(cacheKey);
        if (cachedResult) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            return cachedResult as object;
        }

        const findOptions = this.findOptionsService.getFindOptions(query);
        const options = this.limitOptionsService.limitOptions(findOptions);
        const result = await this.service.getList(options, request);

        const responseData = {
            pagination: {
                total: result.total,
                count: result.data.length,
                offset: options.skip,
            },
            data: result.data,
        };

        this.setToCache(cacheKey, responseData);

        return responseData;
    }

    @Get(':id/:relation')
    async getRelatedItems(
        @Param('id') id: string,
        @Param('relation') relation: string,
        @Req() request: RequestExtended
    ): Promise<any> {
        const login = this.authenticationService.getLogin(request);
        this.logger.access(`${this.constructor.name}.getRelatedItems ${login}`);

        const relations = {};
        relations[relation] = true;

        const result = await this.service.getItem(id, relations, request);

        return {
            data: result[relation],
        };
    }

    @Get(':id')
    async getItem(@Param('id') id: string, @Req() request: RequestExtended): Promise<any> {
        const login = this.authenticationService.getLogin(request);
        this.logger.access(`${this.constructor.name}.getItem ${login}`);

        const result = await this.service.getItem(id, null, request);

        return {
            data: result,
        };
    }
}