import { HttpService } from "@nestjs/axios";
import { Injectable, HttpException } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { map } from "rxjs";
import { SuccessResponse } from "src/success-response";
import { catchError } from "rxjs/operators";
import { ErrorResponse } from "src/error-response";
import { LikeDto } from "src/like/dto/like.dto";
import { LikeSearchDto } from "src/like/dto/like-search.dto";
@Injectable()
export class LikeService {
  constructor(private httpService: HttpService) {}
  url = `${process.env.BASEAPIURL}/Like`;

  public async getLike(likeId: string, request: any) {
    return this.httpService
      .get(`${this.url}/${likeId}`, {
        headers: {
          Authorization: request.headers.authorization,
        },
      })
      .pipe(
        map((axiosResponse: AxiosResponse) => {
          let data = axiosResponse.data;

          const likeDto = new LikeDto(data);
          return new SuccessResponse({
            statusCode: 200,
            message: "ok.",
            data: likeDto,
          });
        }),
        catchError((e) => {
          var error = new ErrorResponse({
            errorCode: e.response?.status,
            errorMessage: e.response?.data?.params?.errmsg,
          });
          throw new HttpException(error, e.response.status);
        })
      );
  }
  public async createLike(request: any, likeDto: LikeDto) {
    return this.httpService
      .post(`${this.url}`, likeDto, {
        headers: {
          Authorization: request.headers.authorization,
        },
      })
      .pipe(
        map((axiosResponse: AxiosResponse) => {
          return new SuccessResponse({
            statusCode: 200,
            message: "Ok.",
            data: axiosResponse.data,
          });
        }),
        catchError((e) => {
          var error = new ErrorResponse({
            errorCode: e.response?.status,
            errorMessage: e.response?.data?.params?.errmsg,
          });
          throw new HttpException(error, e.response.status);
        })
      );
  }

  public async updateLike(likeId: string, request: any, likeDto: LikeDto) {
    var axios = require("axios");
    var data = likeDto;

    var config = {
      method: "put",
      url: `${this.url}/${likeId}`,
      headers: {
        Authorization: request.headers.authorization,
      },
      data: data,
    };
    const response = await axios(config);
    return new SuccessResponse({
      statusCode: 200,
      message: " Ok.",
      data: response.data,
    });
  }

  public async searchLike(request: any, likeSearchDto: LikeSearchDto) {
    return this.httpService
      .post(`${this.url}/search`, likeSearchDto, {
        headers: {
          Authorization: request.headers.authorization,
        },
      })
      .pipe(
        map((response) => {
          const responsedata = response.data.map(
            (item: any) => new LikeDto(item)
          );
          return new SuccessResponse({
            statusCode: response.status,
            message: "Ok.",
            data: responsedata,
          });
        }),
        catchError((e) => {
          var error = new ErrorResponse({
            errorCode: e.response.status,
            errorMessage: e.response.data.params.errmsg,
          });
          throw new HttpException(error, e.response.status);
        })
      );
  }
}