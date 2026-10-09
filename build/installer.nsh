; Nova 5.5.0 — Chrome-inspired Navigation & New Tab Repair
; Conserva los datos del usuario durante la instalación, actualización y desinstalación.
!macro customHeader
  BrandingText "Nova Browser 5.5.0"
  !define MUI_WELCOMEPAGE_TITLE "Bienvenido a Nova 5.5.0"
  !define MUI_WELCOMEPAGE_TEXT "Nova Quantum 5.5.0 · búsqueda y nueva pestaña reparadas, noticias con carga protegida e interfaz adaptable inspirada en Chrome.\r$\n\r$\nPuedes instalar o actualizar Nova sin desinstalar la versión anterior. Tus favoritos, historial, Workspaces, ajustes y datos personales se conservan."
  !define MUI_DIRECTORYPAGE_TEXT_TOP "Elige la carpeta de instalación. Para actualizar Nova normalmente no necesitas cambiarla."
  !define MUI_FINISHPAGE_TITLE "Nova 5.5.0 está listo"
  !define MUI_FINISHPAGE_TEXT "Nova 5.5.0 se ha instalado o actualizado correctamente. Los datos de usuario se conservan."
  !define MUI_UNCONFIRMPAGE_TEXT_TOP "Nova se quitará del equipo. Los datos personales de usuario no se eliminan automáticamente."
!macroend
!macro customInstall
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
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nova\Capabilities" "ApplicationName" "Nova 5.5.0"
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
