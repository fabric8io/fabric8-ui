/**
 * A simple wrapper around a value which can be returned to provide
 * useful information such as that the result is currently loading.
 *
 * This is particularly useful with RXJS as it allows you to emit
 * an object from a stream.
 */
export class ValWrapper<T> {

  /**
   * The value
   */
  val: T;

  /**
   * An optional property. If set to true, it indicates that the
   * val is currently being loaded. This can be used to handle streams
   * that take a long time to return and, for example, display a spinner.
   */
  loading?: boolean;

}
