export function mapPeriodToPresentableString(period) {
    if (period === 3 || period === '3'){
        return "Beide";
    }

    return period.toString();
}
