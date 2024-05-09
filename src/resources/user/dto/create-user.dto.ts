import { SexEnum } from "src/enum/sex.enum";

export class CreateUserDto {
    name: string;
    birthDate: string;
    height: string;
    sex: SexEnum;
    username: string;
    password: string;
    confirmPassword: string;
}
