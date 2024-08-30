import { getDicts } from '../api/system/dict/data';
import { useDictStore } from '../store/modules/dict';

/**
 * 请求字典数据
 * @param dictType
 * @returns {Promise<unknown>}
 */
const _fetchDict = (dictType) => {
  return new Promise((resolve) => {
    getDicts(dictType)
      .then((res) => {
        resolve(res.data || []);
      })
      .catch(() => {
        resolve([]);
      });
  });
};

/**
 * 获取字典数据
 * @param {Ref|string|Array|function} dictType
 * @description 该函数返回一个字典数据对象，该对象会根据传入的dictType自动获取字典数据，并缓存起来，下次获取时直接返回缓存数据。
 * @returns {Ref}
 */
export const useDict = (dictType) => {
  // 获取字典类型
  const dictTypeValue = toValue(dictType);
  let dictTypeKeys = Array.isArray(dictTypeValue)
    ? dictTypeValue
    : [dictTypeValue];

  // 去除重复的dictType
  dictTypeKeys = [...new Set(dictTypeKeys)];

  // 定义返回的字典数据
  const value = ref({});

  // 初始化字典数据
  dictTypeKeys.forEach((key) => {
    value.value[key] = [];
  });

  // 定义请求字典数据的函数
  const getDictFunc = () => {
    const dictStore = useDictStore();
    for (let i = 0; i < dictTypeKeys.length; i++) {
      const key = dictTypeKeys[i];
      // 如果字典数据已经加载过，则直接获取
      if (dictStore.isDictLoaded(key)) {
        value.value[key] = dictStore.getDict(key);
      } else {
        // 如果字典数据没有加载过，则请求字典数据
        _fetchDict(key).then((data) => {
          // 将字典数据存入字典存储器
          dictStore.setDict(key, data);
          value.value[key] = dictStore.getDict(key);
        });
      }
    }
  };

  // 监听dictType变化，重新请求字典数据
  watchEffect(() => {
    getDictFunc();
  });
  return value;
};

/**
 * 获取字典value对应的label
 * @param {String} dictType
 * @param {String | Number | Ref | Function} value
 * @description 注意：模板中直接使用，请在结尾加上.value，如：
 * {{ useSelectDictLabels('dictType', 'dictValue').value }}，
 * 因为模板直接调用会被认为是一个函数调用，而非取值操作，不会自动解析.value。
 * @returns {Ref}
 */
export const useSelectDictLabel = (dictType, value) => {
  const label = ref('');
  const dictStore = useDictStore();
  // 获取字典数据,转为计算属性
  const dictList = computed(() => {
    return dictStore.getDict(dictType);
  });
  // 监听字典数据变化，更新label
  watchEffect(() => {
    label.value =
      dictList.value.find((item) => item.value === String(toValue(value)))
        ?.label || '';
  });
  return label;
};
