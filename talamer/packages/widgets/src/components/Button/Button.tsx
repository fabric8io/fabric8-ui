import React, {Component} from 'react';
import './Button.scss';

export interface ButtonProps {
  /**
   * Button content.
   */
  children: React.ReactChild;

  /**
   * Callback when button is clicked.
   */
  onClick(): void;

  /**
   * The button type.
   */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button component description.
 */
export class Button extends Component<ButtonProps> {
  render() {
    return <button type="button" className="osio-widgets-Button" {...this.props} />;
  }
}

// Example of functional component:
//
// export function Button(props: ButtonProps) {
//   return <button type="button" className="osio-widgets-Button" {...props} />;
// }
