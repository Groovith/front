export function formatDateTime(input: string): string {
    const utcDate = new Date(input);

    // 사용자의 로컬 시간대를 가져와 오프셋을 계산
    const localOffsetMinutes = utcDate.getTimezoneOffset();
    const localDate = new Date(utcDate.getTime() - localOffsetMinutes * 60 * 1000);

    // 날짜와 시간 추출
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");

    let hours = localDate.getHours();
    const minutes = String(localDate.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12 || 12; // 0시를 12시로 표현

    // 최종 포맷
    return `${year}.${month}.${day} ${ampm} ${hours}:${minutes}`;
}
