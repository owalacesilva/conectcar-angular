import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

export class Animations {
  static slideInOutCards: any =
    trigger('slideInOut', [
      state('in', style({transform: 'translateX(0)'})),
      state('out_left', style({transform: 'translateX(-105%)'})),
      state('out_right', style({transform: 'translateX(105%)'})),
      transition('out_left => in', [
        style({transform: 'translateX(-105%)'}),
        animate('500ms ease-out', style({transform: 'translateX(0)'}))
      ]),
      transition('out_right => in', [
        style({transform: 'translateX(105%)'}),
        animate('500ms ease-out', style({transform: 'translateX(0)'}))
      ]),
      transition('in => out_left', [
        style({transform: 'translateX(0)'}),
        animate('500ms ease-out', style({transform: 'translateX(-105%)'}))
      ]),
      transition('in => out_right', [
        style({transform: 'translateX(0)'}),
        animate('500ms ease-out', style({transform: 'translateX(105%)'}))
      ]),
    ])

  static slideInOutCardsOff: any =
    trigger('slideInOut', [
      state('in', style({transform: 'translateX(-50%)'})),
      state('out_left', style({transform: 'translateX(-160%)'})),
      state('out_right', style({transform: 'translateX(60%)'})),
      transition('out_left => in', [
        style({transform: 'translateX(-160%)'}),
        animate('500ms ease-out', style({transform: 'translateX(-50%)'}))
      ]),
      transition('out_right => in', [
        style({transform: 'translateX(60%)'}),
        animate('500ms ease-out', style({transform: 'translateX(-50%)'}))
      ]),
      transition('in => out_left', [
        style({transform: 'translateX(-50%)'}),
        animate('500ms ease-out', style({transform: 'translateX(-160%)'}))
      ]),
      transition('in => out_right', [
        style({transform: 'translateX(-50%)'}),
        animate('500ms ease-out', style({transform: 'translateX(60%)'}))
      ]),
    ])

  static slideInOut: any =
    trigger('slideInOut', [
      transition('void => right', [
        style({transform: 'translateX(-105%)'}),
        animate('500ms ease-out',
          style({transform: 'translateX(0)'})),
      ]),
      transition('right => void', [
        style({transform: 'translateX(0)', position: 'absolute'}),
        animate('500ms ease-out',
          style({transform: 'translateX(105%)'})),
      ]),
      transition('void => left', [
        style({transform: 'translateX(105%)'}),
        animate('500ms ease-out',
          style({transform: 'translateX(0)'})),
      ]),
      transition('left => void', [
        style({transform: 'translateX(0)', position: 'absolute'}),
        animate('500ms ease-out',
          style({transform: 'translateX(-105%)', })),
      ])
    ])

    static slideFromTop: any =
      trigger('slideFromTop', [
        transition('void => bottom', [
          style({transform: 'translateY(-105%)'}),
          animate('500ms ease-out',
            style({transform: 'translateY(0)'})),
        ]),
        transition('bottom => void', [
          style({transform: 'translateY(0)', position: 'absolute'}),
          animate('500ms ease-out',
            style({transform: 'translateY(-105%)', })),
        ])
      ])
}
