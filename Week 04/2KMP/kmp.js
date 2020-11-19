function kmp(source, pattern) {
    // 计算 table
    let table = new Array(pattern.length).fill(0);

    // 准备 table
    {
        let i = 1, j = 0;
    
        while (i < pattern.length) {
            if (pattern[i] === pattern[j]) {
                ++j, ++i;
                table[i] = j;
                
            } else {
                if (j > 0) {
                    j = table[j];
                } else {
                    ++i;
                }
            }
        } 
        // console.log('table: ', table);
    }

    console.log('table: ', table);

    // 匹配
    {
        // i 是 source 串， j 是 pattern 串
        let i = 0, j = 0;
        while (i < source.length) {
            if (pattern[j] === source[i]) {
                ++i, ++j;
            } else {
                if (j > 0) {
                    j = table[j]
                } else {
                    ++i;
                }
            }
            
            if (j === pattern.length) {
                return true;
            }
        }
        return false;
    }

}


// console.log(kmp('aabcdbcee', 'abcdbce')); // 0000000
// kmp('', 'abababc');

// kmp('', 'aabaaac');
// a  a  b  a  a  a  c

// console.log(kmp('abcdabcdabcex', 'abcdabce'));
console.log(kmp('aabaabaacx', 'aabaacx'));

// leetcode 28