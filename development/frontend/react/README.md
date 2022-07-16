# frontend

## 数据

由于`create-react-app`默认不可以引用工程外部的文件，所以我们需要把后端的数据文件给链接过来，方便`react`读取：

```shell
ln data/generated/cities-for-visualization.json development/frontend/react/src/data/
```

## run

```shell
# should generate `data/cities-for-map.json` first via backend
# then run map via react

npm run start
```

## reference

- google map js api(细节要看js api，实现看react api或者内部源码): https://developers.google.com/maps/documentation/javascript
- google map react api: https://react-google-maps-api-docs.netlify.app/
- custom google map theme: https://mapstyle.withgoogle.com/

