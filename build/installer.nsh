; Opciones de personalización del instalador de Nova
!include nsDialogs.nsh
!include LogicLib.nsh
Var NvDlg
Var NvR1
Var NvR2
Var NvR3
Var NvR4
Var NvR5
Var NvAd
Var NvTheme
Var NvAdblock

!macro customPageAfterChangeDir
  Page custom NovaPage NovaLeave
!macroend

Function NovaPage
  nsDialogs::Create 1018
  Pop $NvDlg
  ${NSD_CreateLabel} 0 0 100% 12u "Elige tu tema inicial (podras cambiarlo cuando quieras)"
  Pop $0
  ${NSD_CreateRadioButton} 0 18u 100% 12u "Nova (oscuro moderno)"
  Pop $NvR1
  ${NSD_Check} $NvR1
  ${NSD_CreateRadioButton} 0 34u 100% 12u "Windows 95"
  Pop $NvR2
  ${NSD_CreateRadioButton} 0 50u 100% 12u "Codigo"
  Pop $NvR3
  ${NSD_CreateRadioButton} 0 66u 100% 12u "Undertale"
  Pop $NvR4
  ${NSD_CreateRadioButton} 0 82u 100% 12u "Windows Aero"
  Pop $NvR5
  ${NSD_CreateCheckbox} 0 106u 100% 12u "Activar bloqueador de anuncios"
  Pop $NvAd
  ${NSD_Check} $NvAd
  nsDialogs::Show
FunctionEnd

Function NovaLeave
  StrCpy $NvTheme "nova"
  ${NSD_GetState} $NvR2 $0
  ${If} $0 == 1
    StrCpy $NvTheme "win95"
  ${EndIf}
  ${NSD_GetState} $NvR3 $0
  ${If} $0 == 1
    StrCpy $NvTheme "code"
  ${EndIf}
  ${NSD_GetState} $NvR4 $0
  ${If} $0 == 1
    StrCpy $NvTheme "undertale"
  ${EndIf}
  ${NSD_GetState} $NvR5 $0
  ${If} $0 == 1
    StrCpy $NvTheme "aero"
  ${EndIf}
  ${NSD_GetState} $NvAd $0
  ${If} $0 == 1
    StrCpy $NvAdblock "true"
  ${Else}
    StrCpy $NvAdblock "false"
  ${EndIf}
FunctionEnd

!macro customInstall
  CreateDirectory "$APPDATA\Nova"
  FileOpen $0 "$APPDATA\Nova\install.json" w
  FileWrite $0 '{"theme":"$NvTheme","adblock":$NvAdblock}'
  FileClose $0
!macroend
