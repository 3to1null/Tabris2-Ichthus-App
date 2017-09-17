module.exports = (appointment, cellIndex) => {
  let rowIsOdd = false;
  if (cellIndex < 5 ||
    (cellIndex >= 10 && cellIndex < 15) ||
    (cellIndex >= 20 && cellIndex < 25) ||
    (cellIndex >= 30 && cellIndex < 35) ||
    (cellIndex >= 40 && cellIndex < 45)
  ) {
    rowIsOdd = true;
  }
  if (appointment === 'False' || appointment === false || appointment === 'false') {
    return rowIsOdd ? '#b3b3b3' : '#cccccc';
  } else if (appointment['cancelled'] === true) {
    return rowIsOdd ? '#ff0000' : '#ff3333';
  } else if (appointment['moved'] === true) {
    return rowIsOdd ? '#ff9900' : '#ffad33';
  } else {
    return rowIsOdd ? '#ccccff' : '#e6e6ff';
  }
};
