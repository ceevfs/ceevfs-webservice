const {allMajor} = require('../../sdk/major')

exports.route = {
  async get() {

    let result=[]
    for(let i=0;i<allMajor.length;i++){
      let b={}
      b['name']=allMajor[i].门类
      b['code']=allMajor[i].专业代码[0]+allMajor[i].专业代码[1]
      b['children']=[]
      result.push(b)
    }

    //去重
    let hash={}
    result = result.reduce((item,next)=>{
      hash[next.name] ? '' : hash[next.name] = true && item.push(next);
      return item
    }, []);

    let res2=[]
    for(let i=0;i<allMajor.length;i++){
      for(let j=0;j<result.length;j++){
        if(allMajor[i].门类==result[j].name){
          let b={}
          b['name']=allMajor[i].专业类
          b['code']=allMajor[i].专业代码[0]+allMajor[i].专业代码[1]+allMajor[i].专业代码[2]+allMajor[i].专业代码[3]
          b['children']=[]
          result[j].children.push(b)
        }
      }
    }

    hash={}
    for(let j=0;j<result.length;j++){
      result[j].children = result[j].children.reduce((item,next)=>{
        hash[next.name] ? '' : hash[next.name] = true && item.push(next);
        return item
      }, []);
    }

    for(let i=0;i<allMajor.length;i++){
      for(let j=0;j<result.length;j++){
        for(let k=0;k<result[j].children.length;k++){
          if(allMajor[i].门类==result[j].name&&allMajor[i].专业类==result[j].children[k].name){
            let b={}
            b['name']=allMajor[i].专业名称
            b['code']=allMajor[i].专业代码
            result[j].children[k].children.push(b)
          }
        }
      }
    }

    return result
  }
}
