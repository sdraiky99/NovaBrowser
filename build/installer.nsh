; Nova 4.3.2 · instalador estable
; No sustituye el contenido del perfil ni borra userData.

!macro customHeader
  BrandingText "Nova Browser 4.3.2"
  !define MUI_WELCOMEPAGE_TITLE "Bienvenido a Nova"
  !define MUI_WELCOMEPAGE_TEXT "Nova 4.3.2 · Glass Clean, sitios fijados y ahorro de energía.$\r$\n$\r$\nEste asistente instalará o actualizará Nova para tu usuario. Tus datos de navegación y ajustes se conservan."
  !define MUI_DIRECTORYPAGE_TEXT_TOP "Elige la carpeta donde se instalará Nova. Nova puede actualizarse sobre una instalación existente sin desinstalarla primero."
  !define MUI_FINISHPAGE_TITLE "Nova está listo"
  !define MUI_FINISHPAGE_TEXT "Nova 4.3.2 se ha instalado o actualizado correctamente. Tus datos de usuario se conservan."
  !define MUI_UNCONFIRMPAGE_TEXT_TOP "Nova se quitará de tu equipo. Los datos de usuario se conservan."
!macroend

!macro customInstall
  ; Registro de Nova como navegador disponible. Windows decide el navegador predeterminado.
  WriteRegStr HKCU "Software\Classes\NovaURL" "" "Nova URL"
  WriteRegStr HKCU "Software\Classes\NovaURL" "URL Protocol" ""
  WriteRegStr HKCU "Software\Classes\NovaURL\DefaultIcon" "" '$INSTDIR\${APP_EXECUTABLE_FILENAME},0'
  WriteRegStr HKCU "Software\Classes\NovaURL\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%1"'
  WriteRegStr HKCU "Software\Classes\NovaHTML" "" "Nova HTML Document"
  WriteRegStr HKCU "Software\Classes\NovaHTML\DefaultIcon" "" '$INSTDIR\${APP_EXECUTABLE_FILENAME},0'
  WriteRegStr HKCU "Software\Classes\NovaHTML\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%1"'
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova" "" "Nova"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\DefaultIcon" "" '$INSTDIR\${APP_EXECUTABLE_FILENAME},0'
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}"'
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities" "ApplicationName" "Nova"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities" "ApplicationIcon" '$INSTDIR\${APP_EXECUTABLE_FILENAME},0'
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities" "ApplicationDescription" "Navegador web moderno basado en Chromium"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities\URLAssociations" "http" "NovaURL"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities\URLAssociations" "https" "NovaURL"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities\FileAssociations" ".html" "NovaHTML"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities\FileAssociations" ".htm" "NovaHTML"
  WriteRegStr HKCU "Software\RegisteredApplications" "Nova" "Software\Clients\StartMenuInternet\Nova\Capabilities"
!macroend

!macro customUnInstall
  DeleteRegKey HKCU "Software\Classes\NovaURL"
  DeleteRegKey HKCU "Software\Classes\NovaHTML"
  DeleteRegKey HKCU "Software\Clients\StartMenuInternet\Nova"
  DeleteRegValue HKCU "Software\RegisteredApplications" "Nova"
!macroend
