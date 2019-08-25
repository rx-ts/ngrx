# 翻译模块

## 基本类型

```ts
export interface Translation {
  [key: string]: Arrayable<string | number | boolean | Translation>
}

export type Translations = Partial<Record<Locale, Translation>>

export type TranslateKey = string | Partial<Record<Locale, string>>

export interface TranslateOptions {
  locale?: Locale // 当前区域，默认从 localStorage 或浏览器默认设置中获取
  defaultLocale?: Locale // 解析翻译时如果当前区域未找到，继续回退尝试的区域
  locales?: Locale[] // 可用区域列表，调用 `toggleLocale` 时自动滚动循环设置区域
  translations?: Translations // 初始翻译包
  loose?: boolean // 是否启用宽松模式，如果当前区域找不到翻译时回退尝试国家区域，即 `zh-* -> zh`, `en-* -> en`
  remoteTranslations?: Translations // 提前加载的远程翻译包，解析翻译时优先级高于 translations
  remoteUrl?: string // 远程翻译包解析链接，如果是绝对链接将直接请求，否则使用 baseHref 拼接后请求，优先级高于 remoteTranslations，如果未提供 remoteTranslations 将默认尝试从 DEFAULT_REMOTE_URL 获取，否则默认不从远程获取
}
```

## `TranslateService`

- `get(key: TranslateKey, data?: unknown, ignoreNonExist?: boolean)`:
  根据翻译 key 和上下文数据 data 获取翻译内容，翻译项不存在直接返回 key 文本，ignoreNonExist 开发环境是否忽视不存在的翻译项
- `toggleLocale()`: 根据 `locales` 循环切换当前区域设置
- `fetchTranslation(remoteUrl: string, locale?: string)`: 从远程 url 模板和区域获取翻译包
- `Observable` 属性列表:
  - `locale$`
  - `defaultLocale$`
  - `remoteLoaded$`
- 响应式属性列表:
  - `locale`
  - `defaultLocale`
- 只读属性: `remoteLoaded`

## `TranslatePipe`

自动响应 `TranslateService#locale` 和 `TranslateService#defaultLocale` 的变化，支持静态语言包和服务端返回的动态语言对象

```html
<ng-container>{{ 'hello' | translate:'world' }}</ng-container>
<ng-container>
  {{ { en: 'Hello World!', zh: '你好世界！' } | translate }}
</ng-container>
```
