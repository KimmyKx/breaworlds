async function fun() {
    this.a = "a"
}
const f = new fun()
console.log(f.a)