# 学习笔记 Week 7

JS语言结构

* Atom
  * Grammer
    * Grammer Tree VS Priority
      * Left hand side & Right hand side
  * Runtime
    * Type Convertion
      * Reference
* Expression
* Statement
  * Grammer
    * 简单语句
    * 组合语句
    * 声明
  * Runtime
    * Completion Record
    * Lexical Environment
* Structure
* Program / Module

## Expression

### Grammer

#### Tree VS Priority

* \+ -
* \* /
* ()

#### Expressions (优先级最末的一个结构)

优先级从高到底排列：

1. Member
    * a.b
    * a[b]
    * foo\`string`
    * super.b
    * suoer[`b`]
    * new.target
    * new Foo()
  
2. New
    * new Foo
      * Example:
        new a()() = (new a())()
        new new a() = new (new a())

3. Call
    * foo()
    * super()
    * foo()['b'] Member Expression 这里会被拉低优先级
    * foo().b
    * foo()\`abc`
      * Example:
        new a()['b'] = (new a())['b']

4. Update (从 Update 开始就是 RH 了)
    * a ++
    * a --
    * -- a
    * ++ a
      * Example:
        ++ a ++ = ++ (a++) 但他们语法和运行时都是不合法的

5. Unary (单目运算)
    * delete a.b (a.b 是 Reference 类型)
    * void foo() (void 是把不管后面什么东西都变成 undefined)
    * typeof a
    * \+a (类型转换)
    * \-a
    * ~a (按位取反)
    * !a
    * await a

6. Exponental (右结合，其他大部分是左结合)
    * \*\*
      * Example:
        3 \*\* 2 \*\* 3 = 3 \*\* ( 2 \*\* 3 )

7. Multiplicative
    * \* / %

8. Additive
    * \+ -

9. shift
    * << >> >>>

10. Relationship
    * < > <= >= instanceof
    * in

11. Equality
    * ==
    * !=
    * ===
    * !==

12. Bitwise
    * & 按位与
    * ^ 亦或
    * | 按位或

13. Logical (短路逻辑)
    * &&
    * ||

14. Conditional (也有短路逻辑)
    * ? :

##### Reference (Reference 是标准中的类型，7种基本类型是语言中的类型)

reference 分成两部分

* Object
* Key (String | Symbol)

如果是加减法运算，reference 就会直接解引用，像普通变量取使用
当删除和赋值时要知道主体是谁，是哪个属性

* delete
* assign

##### Expressions (Left Handside & Right Handside)

Example:

* a.b = c a.b 是 LH，所以可以放在 = 左边
* a + b = c a+b 是 RH，只能放在 = 右边

LH 定义就是能放在等号左边的表达式，不能的就是 RH

### Runtime

#### Type Convertion

* a + b
* "false" == false (不等，"" 是 falsy) == 一般先被转为 Number，再转 boolean
* a[o] = 1

| | Number | String | Boolean | Undefined | Null | Object | Symbol |
|-|-|-|-|-|-|-|-|
| Number | | | 0 false | x | x | Boxing | x |
| String | | | "" false | x | x | Boxing | x |
| Boolean | true 1, false 0 | 'true', 'false' | | x | x | Boxing | x |
| Undefined | NaN | 'undefined' | false | | x | x | x |
| Null | 0 | 'null' | false | x | | x | x |
| Object | valueOf | valueOf, toString | true | x | x | | x |
| Symbol | x | x | x | x | x | Boxing | |

##### unBoxing

* ToPremtitive
  * toString vs valueOf
  * Symbol.toPrimitive

```js
    toString() { return '2' },
    valueOf() { return 1 },
    \[ Symbol.toPrimitive ]() { return 3} (优先级最高)

    // 作为属性名，优先调用 toString
    var x = {};
    x[o] = 1

    // 加法优先调用 valueOf
    console.log("x" + o)
```

##### Boxing

| 类型 | 对象 | 值 |
|-|-|-|-|
| Number | new Number(1) | 1 |
| String | new String('a') | 'a' |
| Boolean | new Boolean(true) | true |
| Symbol | new Object(Symbol('a')) | Symbol('a') |

```js
'a'[b] // 'a' 被取属性 b，会自动调用装箱(Boxing)构造器
```

Number Class 上定义的值和 number 值不同，可通过 typeOf 查看
