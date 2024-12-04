export function formatDateTime(input: string): string {
    const utcDate = new Date(input);

    // KST 변환: UTC + 9시간
    const kstOffset = 9 * 60; // 9시간을 분 단위로 변환
    const kstDate = new Date(utcDate.getTime() + kstOffset * 60 * 1000);

    // 날짜와 시간 추출
    const year = kstDate.getFullYear();
    const month = String(kstDate.getMonth() + 1).padStart(2, "0");
    const day = String(kstDate.getDate()).padStart(2, "0");

    let hours = kstDate.getHours();
    const minutes = String(kstDate.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "오후" : "오전";
    hours = hours % 12 || 12; // 0시를 12시로 표현

    // 최종 포맷
    return `${year}.${month}.${day} ${ampm} ${hours}:${minutes}`;
}