const month = (month) => {
    switch (month) {
        case 0:
            return 'Jan';
        case 1:
            return 'Feb';
        case 2:
            return 'Mar';
        case 3: 
            return 'Apr';
        case 4:
            return 'May';
        case 5: 
            return 'Jun';
        case 6:
            return 'Jul';
        case 7:
            return 'Aug';
        case 8:
            return 'Sep';
        case 9:
            return 'Oct';
        case 10:
            return 'Nov';
        case 11:
            return 'Dec';
        default:
            return null;
    };
};

const year = (year) => {
    year = year.toString();
    return year.slice(2,4);
}

const parseDate = (date) => {
    console.log(`${date.getDate()}-${month(date.getMonth())}-${year(date.getFullYear())}`)
    return `${date.getDate()}-${month(date.getMonth())}-${year(date.getFullYear())}`;
}

module.exports = parseDate;