import { Entry } from "src/resources/entry/entities/entry.entity";

export function sleepTime(entry: Entry) {
    const splitStart = entry.dateStart.split('/');
    const splitEnd = entry.dateEnd.split('/');
    const start = new Date(
      `${splitStart[1]}/${splitStart[0]}/${splitStart[2]}` +
        ' ' +
        entry.timeStart,
    );
    const end = new Date(
      `${splitEnd[1]}/${splitEnd[0]}/${splitEnd[2]}` + ' ' + entry.timeEnd,
    );
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);
    return `${Math.abs(hours) < 10 ? `0${Math.abs(hours)}` : Math.abs(hours)}:${
      Math.abs(minutes) < 10 ? `0${Math.abs(minutes)}` : Math.abs(minutes)
    }:${Math.abs(seconds) < 10 ? `0${Math.abs(seconds)}` : Math.abs(seconds)}`;
  }