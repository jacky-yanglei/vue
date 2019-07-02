export default function(type, data, limit = 0) {
  switch (type) {
    case 'ip':
      return /^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(data)
    case 'min':
      return data.length >= limit
    case 'max':
      return data.length <= limit
  }
}
