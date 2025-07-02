export const statusOption = [
  { label: '待审核', value: 0 },
  { label: '审核通过', value: 1 },
  { label: '审核失败', value: 2 },
  { label: '已上架', value: 3 },
  { label: '已下架', value: 4 }
]

export const statusMap = statusOption.reduce((pre, cur) => {
  pre[cur.value] = cur.label
  return pre
}, {})

export const defaultCircleIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAAXNSR0IArs4c6QAAAD9QTFRFR3BM6/T/7fX/6/X/7PX/6PL/7PX/6/X/7PT/6/T/6/T/6/P/6/T/con+rb3/zdr/3ej/f5X/vcv/jKD/na//GHGSSQAAAAx0Uk5TANBHtPQX4C5sk6XBmXu72gAAAxNJREFUeNq9mtuSpCAMhlEBwQkJp/d/1t11qrZ7xsZEsfiu5qJrYv5wyAElxczOL5PVGkBrOy3ezUY9yeo2Cx+wm1sfsuAnOGHy3XaMm4BlcqbLCRBy2511gwtsd8wYDxfxl0VzGi6j3TWlFrjFsva48bwzHjrwsoh/QRdfRhAOC51YNjCzhm70zNiAR5j7bPRbWTU8hG7GxVh4DNtaY1/wIF8de7BzVzp4GNcR9J7gLyAgZqwFCWQst8TCFHYS3hLMaGChEv5Tokgwc3VlxRTeocsrbAWeGn6QQMJ77DdgwfALBAHbNUdK+I3YFXlEwoF8KSoGRGrd0guMeI9QDUfqpb0ySdw4UkDCJAt73N1oyUWRDz0fdgo7jcAju/m9QC0MDdL+z/c/GL1YtXJgHNkPMlYvJ9QqfVpbYaew62sTHYo1wg8rJb5ridzRYqFNOWjzsvmPKtn9VikjCQj9urQyfEPptQraGDULHKnv92/OFI8xw9N00vGOVIGz5TTynnGE2wfIR8Wrhf1IhFMS68qiJu6+LcLTM57sect9YoZzIquXVZrb7AQMrMe6bQSltwZx6YtW3Aei+PqHJm0jkXaAh4280tANFzz9hJHEGrHQScTCGLHnl2/MmSiyyRJjZDorfrC8Lo8GKMkoF+UlmRBKMv1EzQPStXRIfLa42+CtODVzt3tbiyhMXGdlhOkWSdIlauXcVpY2VknJUhuJhNpajrDlWzjSSokcH9IdEtRFqZXcrbLiLeBdI2sr4U6C6o3CgdIsULzMCAl+VJulwyorGKLgR/RZrYZeJJGbhGrtOGbD7ySM7BrEk8LUyIqfhC81YvxgJZ+V2MpLy7hU8B81hZBlR70/tj3aWrQWQq5NNXdWpoGTSzhyDADhXzJ8ZuNbUVhLShXpszW61oria/lyryPhufYgrx2J24PyJg6+2ymYI3C4Wy1bwm8ogoBlSPN5RBt9xEBgxGhjyJBmxLhpxOBsxAhw2DBz/Fh2/IC5f1Q+eug//vnC+IcY/U9Kxj+OGf/Mp//B0vinV+MfkQ15DvcHYnN5W/cfYr0AAAAASUVORK5CYII="

export const defaultProductIcon = "https://www.aeotrade.com/aeoapi/img/oss/aeotrade-launch-advisor/d02ac796e95fbb79589d3c95be3cd4a33ec15da3de115b7738a742fe8fafda8b.png"