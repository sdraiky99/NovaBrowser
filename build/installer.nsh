!include nsDialogs.nsh
!include LogicLib.nsh

Var NvPage
Var NvName
Var NvTheme
Var NvThemeNova
Var NvThemeNeon
Var NvAd
Var NvDesktop
Var NvRestore
Var NvPrivate
Var NvShortcut

!macro customPageAfterChangeDir
  Page custom NovaOptionsPage NovaOptionsLeave
!macroend

Function NovaOptionsPage
  nsDialogs::Create 1018
  Pop $NvPage
  ${If} $NvPage == error
    Abort
  ${EndIf}

  ${NSD_CreateLabel} 0 0 100% 18u "Personaliza tu instalación de Nova"
  Pop $0
  ${NSD_CreateLabel} 0 20u 100% 24u "Elige tu experiencia inicial. Puedes cambiarlo todo más tarde desde Ajustes."
  Pop $0

  ${NSD_CreateLabel} 0 50u 55u 12u "Nombre"
  Pop $0
  ${NSD_CreateText} 58u 47u 175u 14u ""
  Pop $NvName

  ${NSD_CreateLabel} 0 76u 55u 12u "Tema"
  Pop $0
  ${NSD_CreateRadioButton} 58u 73u 80u 12u "Nova"
  Pop $NvThemeNova
  ${NSD_Check} $NvThemeNova
  ${NSD_CreateRadioButton} 140u 73u 80u 12u "Neón"
  Pop $NvThemeNeon

  ${NSD_CreateCheckbox} 0 101u 225u 12u "Activar bloqueador de anuncios y rastreadores"
  Pop $NvAd
  ${NSD_Check} $NvAd

  ${NSD_CreateCheckbox} 0 120u 225u 12u "Restaurar mis pestañas al volver a abrir Nova"
  Pop $NvRestore
  ${NSD_Check} $NvRestore

  ${NSD_CreateCheckbox} 0 139u 225u 12u "Crear acceso directo en el escritorio"
  Pop $NvDesktop
  ${NSD_Check} $NvDesktop

  ${NSD_CreateLabel} 0 165u 100% 22u "Consejo: Nova se instala solo para tu usuario y no necesita permisos de administrador."
  Pop $0
  nsDialogs::Show
FunctionEnd

Function NovaOptionsLeave
  StrCpy $NvTheme "nova"
  ${NSD_GetState} $NvThemeNeon $4
  ${If} $4 == 1
    StrCpy $NvTheme "neon"
  ${EndIf}
  ${NSD_GetState} $NvAd $0
  ${If} $0 == 1
    StrCpy $0 "true"
  ${Else}
    StrCpy $0 "false"
  ${EndIf}
  ${NSD_GetState} $NvRestore $1
  ${If} $1 == 1
    StrCpy $1 "true"
  ${Else}
    StrCpy $1 "false"
  ${EndIf}
  ${NSD_GetText} $NvName $2

  CreateDirectory "$APPDATA\Nova"
  FileOpen $3 "$APPDATA\Nova\install.cfg" w
  FileWrite $3 "theme=$NvTheme$\r$\n"
  FileWrite $3 "adblock=$0$\r$\n"
  FileWrite $3 "restoreTabs=$1$\r$\n"
  FileWrite $3 "name=$2$\r$\n"
  FileClose $3
FunctionEnd

!macro customInstall
  ${NSD_GetState} $NvDesktop $0
  ${If} $0 == 1
    CreateShortCut "$DESKTOP\Nova Browser.lnk" "$INSTDIR\Nova Browser.exe"
  ${EndIf}
!macroend
