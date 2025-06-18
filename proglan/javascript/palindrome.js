// За масиви и низове.
var palindrome = function(s) {
  var n = s.length-1
  if (n <= 0) return true
  return s[0] == s[n] && palindrome(s.slice(1,n))
}
