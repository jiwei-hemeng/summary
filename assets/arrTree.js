// 树形数组转普通数组
export function treeToArr(data) {
  const result = [];
  data.forEach(item => {
    const loop = data => {
      result.push({
        id: data.key, // 此处的id对应子节点的parentId
        termName: data.termName,
        termValue: data.termValue,
        parentId: data.parentId
      });
      let child = data.children
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i])
        }
      }
    }
    loop(item);
  })
  return result;
}
// 普通数组转树形数组
export function arrToTree(data, pId) {
  const loop = parentId => {
    const res = []
    data.forEach(item => {
      if (item.parentId === parentId) {
        item.children = loop(item.id)
        res.push(item)
      }
    })
    return res
  }
  return loop(pId)
}

// 普通数组转树形数组, 如果children的长度等于0，children 赋值null
export function arrToTree2(data, pId) {
  const loop = parentId => {
    const res = []
    data.forEach(item => {
      if (item.parentId === parentId) {
        if(loop(item.id).length > 0) {
          item.children = loop(item.id)
        } else {
          item.children = null
        }
        res.push(item)
      }
    })
    return res
  }
  return loop(pId)
}

// 将树形数组中的sonList替换成children
export function tranformTreeArr(treeDate) {
  function loop(data) {
    let arr = [];
    data.forEach((item) => {
      if(item.sonList) {
        if(item.sonList.length > 0) {
          item.children = loop(item.sonList)
        } else {
          item.children = null;
        }
        item.sonList = null
      }
      arr.push(item)
    })
    return arr
  }
  return loop(treeDate);
}
