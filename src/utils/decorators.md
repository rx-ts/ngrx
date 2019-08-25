The `evens$`and `odds$` observables are passed as plain inputs,
but that are transformed into observables again automatically by `ObservableInput` decorator.

```ts
@Component({
  selector: 'rx-decorator',
  templateUrl: 'template.html',
})
export class DecoratorsComponent {
  @ObservableInput()
  @Input(true)
  evens$!: Observable<number>

  @ObservableInput()
  @Input(true)
  odds$!: Observable<number>

  merged$ = merge(this.evens$, this.odds$)
}
```
