function intervalIntersects(
  interval1Start,
  interval1End,
  interval2Start,
  interval2End
  ) {
    return !((interval2End < interval1Start) || (interval2Start > interval1End))
  }