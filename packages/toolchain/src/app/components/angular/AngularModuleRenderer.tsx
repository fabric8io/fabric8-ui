import React, { Component } from 'react';
import { union } from 'lodash-es';
import './polyfills';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  NgModuleRef,
  ApplicationRef,
  ComponentRef,
  SimpleChange,
  enableProdMode,
  PlatformRef,
  CompilerOptions,
  Type,
  NgZone,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BootstrapOptions } from '@angular/core/src/application_ref';
import { withRouter, RouteComponentProps } from 'react-router';
import { Location, UnregisterCallback } from 'history';
import { Subscription } from 'rxjs';
import shallowEqual from './shallowEqual';

export interface AngularModuleRendererProps {
  props?: {};
  module: Type<any>;
  selector: string;
  compilerOptions?: (CompilerOptions & BootstrapOptions) | (CompilerOptions & BootstrapOptions)[];
}

type Props = AngularModuleRendererProps & RouteComponentProps;

if (process.env.ENV === 'production') {
  enableProdMode();
}

export class AngularModuleRenderer extends Component<Props> {
  private platformRef: PlatformRef;

  private moduleRef: NgModuleRef<any>;

  private componentRef: ComponentRef<any>;

  private nodeRef = React.createRef<HTMLElement>();

  private routerSubscription: Subscription;

  private historyListenerDisposer: UnregisterCallback;

  private routerTimeout: NodeJS.Timer;

  private historyTimeout: NodeJS.Timer;

  shouldComponentUpdate(nextProps: AngularModuleRendererProps) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.props.props, nextProps.props);
  }

  componentDidUpdate(prevProps: AngularModuleRendererProps) {
    if (!shallowEqual(prevProps.props, this.props)) {
      this.mergeProps(prevProps.props);
    }
  }

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    this.routerTimeout && clearTimeout(this.routerTimeout);
    this.historyTimeout && clearTimeout(this.historyTimeout);

    if (this.moduleRef) {
      // eslint-disable-next-line typescript/no-non-null-assertion
      const node = this.nodeRef.current!;
      const { parentNode, nextSibling } = node;

      this.moduleRef.destroy();
      this.platformRef.destroy();

      if (parentNode) {
        // now reattach dom node so that react doesn't barf
        parentNode.insertBefore(node, nextSibling);
      }
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      delete this.routerSubscription;
    }
    if (this.historyListenerDisposer) {
      this.historyListenerDisposer();
      delete this.historyListenerDisposer;
    }
  }

  render() {
    return React.createElement(this.props.selector, { ref: this.nodeRef });
  }

  private mergeProps(prevProps?: { [k: string]: any }) {
    const prevPropsKeys = prevProps ? Object.keys(prevProps) : null;
    const propsKeys = this.props.props ? Object.keys(this.props.props) : null;

    const allKeys = union(prevPropsKeys, propsKeys);

    if (allKeys.length > 0) {
      let runDetectChanges = false;
      const { instance } = this.componentRef;
      const changes: { [name: string]: any } | undefined = instance.ngOnChanges ? {} : undefined;

      allKeys.forEach((key) => {
        const prevValue = instance[key];
        const value = this.props.props
          ? (this.props.props as { [n: string]: any })[key]
          : undefined;

        if (prevValue !== value) {
          runDetectChanges = true;
          if (changes) {
            changes[key] = new SimpleChange(instance[key], value, true);
          }

          this.componentRef.instance[key] = value;

          if (changes) {
            this.componentRef.instance.ngOnChanges(changes);
          }
        }
      });

      if (runDetectChanges) {
        this.componentRef.changeDetectorRef.detectChanges();
      }
    }
  }

  private async load() {
    const { module, compilerOptions } = this.props;
    this.platformRef = platformBrowserDynamic();
    this.moduleRef = await this.platformRef.bootstrapModule(module, compilerOptions);

    const router = this.moduleRef.injector.get(Router);
    if (router) {
      this.routerSubscription = router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.routerTimeout = setTimeout(() => {
            // if the url does not match the current state of the react-router history, push the new state
            if (this.props.history.createHref(this.props.history.location) !== router.url) {
              const { pushState } = history;
              // create a noop
              history.pushState = () => {};

              // push state to react-router
              this.props.history.push(router.url);

              // return to original pushState
              history.pushState = pushState;
            }
          }, 1);
        }
      });
      this.historyListenerDisposer = this.props.history.listen((location: Location<any>) => {
        this.historyTimeout = setTimeout(() => {
          if (this.props.history.createHref(this.props.history.location) !== router.url) {
            const { pushState } = history;
            // create a noop
            history.pushState = () => {};

            // sync the angular router with the react router
            this.moduleRef.injector.get(NgZone).run(() => {
              router.navigateByUrl(this.props.history.createHref(location));
            });

            // return to original pushState
            history.pushState = pushState;
          }
        }, 1);
      });
    }

    [this.componentRef] = this.moduleRef.injector.get(ApplicationRef).components;

    if (this.componentRef) {
      this.mergeProps();
    }
  }
}

export default withRouter(AngularModuleRenderer);
