import { UserDetailsDto } from "../dto/user-dateils.dto";
import { User } from "../entities/user.entity";

function getAge(birthdate: string) {
    const [day, month, year] = birthdate.split('/').map(Number);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    let age = currentYear - year;
    if (currentMonth < month - 1 || (currentMonth === month - 1 && currentDay < day)) {
        age--;
    }

    return age.toString();
}

export class UserConverter {
    static userToUserDetailsDto(user: User, sleepTimeAverage: string) {
        const dto = new UserDetailsDto();
        dto.name = user.name;
        dto.age = getAge(user.birthDate);
        dto.sex = user.sex;
        dto.height = user.height;
        dto.sleepTimeAverage = sleepTimeAverage;
        return dto;
    }
}