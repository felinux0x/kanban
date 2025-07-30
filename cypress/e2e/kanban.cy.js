describe('Kanban - Fluxos principais', () => {
  beforeEach(() => {
    cy.visit('https://kanban-dusky-five.vercel.app/')
    cy.get('body').should('be.visible')
    cy.wait(2000) // Aguarda carregamento completo
  })

  it('Cria uma nova lista (coluna)', () => {
    cy.contains('Adicionar outra lista').should('be.visible').click()
    cy.get('input[type="text"]').should('be.visible').type('Lista QA')
    cy.contains('Adicionar Lista').should('be.visible').click()
    cy.contains('Lista QA').should('be.visible')
  })

  it('DEBUG: Investigar estrutura completa da aplicação', () => {
    // Primeiro vamos ver a estrutura geral da página
    cy.get('body').then(($body) => {
      const body = $body[0]
      console.log('=== ESTRUTURA GERAL DA PÁGINA ===')
      console.log('HTML completo do body (primeiros 2000 chars):', body.innerHTML.substring(0, 2000))
    })

    // Cria uma lista para investigar
    cy.contains('Adicionar outra lista').should('be.visible').click()
    cy.get('input[type="text"]').should('be.visible').type('Lista DEBUG')
    cy.contains('Adicionar Lista').should('be.visible').click()
    cy.contains('Lista DEBUG').should('be.visible')
    cy.wait(1000)

    // Vamos investigar TODOS os elementos da página após criar a lista
    cy.get('body').then(($body) => {
      const body = $body[0]
      console.log('=== APÓS CRIAR LISTA ===')
      
      // Procura por qualquer elemento que contenha "Lista DEBUG"
      const allElements = Array.from(body.querySelectorAll('*'))
      const listElement = allElements.find(el => el.textContent.includes('Lista DEBUG'))
      
      if (listElement) {
        console.log('Elemento que contém "Lista DEBUG":', listElement.outerHTML)
        console.log('Parent do elemento:', listElement.parentElement.outerHTML)
        
        // Siblings
        const siblings = Array.from(listElement.parentElement.children)
        console.log('Siblings do elemento:', siblings.map(el => el.outerHTML))
      }

      // Procura por TODOS os elementos clicáveis na página inteira
      const allClickables = allElements.filter(element => {
        return element.tagName === 'BUTTON' || 
               element.tagName === 'A' || 
               element.getAttribute('role') === 'button' ||
               element.getAttribute('onclick') ||
               window.getComputedStyle(element).cursor === 'pointer' ||
               element.classList.contains('clickable') ||
               element.tagName === 'SVG' ||
               element.querySelector('svg')
      })
      
      console.log('=== TODOS OS ELEMENTOS CLICÁVEIS ===')
      console.log('Total de elementos clicáveis:', allClickables.length)
      allClickables.forEach((element, index) => {
        console.log(`Clicável ${index}:`, {
          tag: element.tagName,
          class: element.className,
          text: element.textContent.trim().substring(0, 50),
          html: element.outerHTML.substring(0, 150) + '...'
        })
      })

      // Procura especificamente por elementos próximos à "Lista DEBUG"
      if (listElement && listElement.parentElement) {
        console.log('=== ELEMENTOS PRÓXIMOS À LISTA ===')
        const nearListElements = Array.from(listElement.parentElement.querySelectorAll('*'))
        nearListElements.forEach((element, index) => {
          if (element.textContent.trim() || element.tagName === 'SVG' || element.tagName === 'BUTTON') {
            console.log(`Próximo à lista ${index}:`, {
              tag: element.tagName,
              class: element.className,
              text: element.textContent.trim(),
              html: element.outerHTML.length > 200 ? element.outerHTML.substring(0, 200) + '...' : element.outerHTML
            })
          }
        })
      }
    })
  })

  it('Tentativa manual de adicionar tarefa', () => {
    // Cria lista
    cy.contains('Adicionar outra lista').should('be.visible').click()
    cy.get('input[type="text"]').should('be.visible').type('Lista TESTE')
    cy.contains('Adicionar Lista').should('be.visible').click()
    cy.contains('Lista TESTE').should('be.visible')
    cy.wait(1000)

    // Estratégia mais simples: tenta clicar sequencialmente em elementos específicos
    const elementsToTry = [
      'svg',                    // Pode ser um ícone SVG
      '[class*="add"]',         // Classes com "add"
      '[class*="plus"]',        // Classes com "plus"
      '[class*="create"]',      // Classes com "create"
      'button:empty',           // Botões vazios (só ícone)
      'p:empty',               // Parágrafos vazios (só ícone)
      'div[role="button"]',     // Divs com role de botão
      '[title*="add"]',         // Elementos com title contendo "add"
      '[aria-label*="add"]'     // Elementos com aria-label contendo "add"
    ]

    let elementIndex = 0
    
    const tryNextElement = () => {
      if (elementIndex >= elementsToTry.length) {
        console.log('❌ Nenhum elemento funcionou')
        return
      }

      const selector = elementsToTry[elementIndex]
      console.log(`Tentando seletor ${elementIndex}: ${selector}`)
      
      // Primeiro verifica se o elemento existe
      cy.get('body').then(($body) => {
        const elements = $body.find(selector)
        if (elements.length === 0) {
          console.log(`❌ Seletor ${selector} não encontrou elementos`)
          elementIndex++
          tryNextElement()
          return
        }

        console.log(`✓ Encontrados ${elements.length} elementos com ${selector}`)
        
        // Conta inputs antes
        const inputsBefore = $body.find('input[type="text"]').filter(':visible').length
        console.log(`Inputs antes: ${inputsBefore}`)
        
        // Tenta clicar no primeiro elemento encontrado
        cy.get(selector).first().click({ force: true })
        
        // Quebra a chain e verifica o resultado
        cy.wait(500)
        cy.get('body').then(($bodyAfter) => {
          const inputsAfter = $bodyAfter.find('input[type="text"]').filter(':visible').length
          console.log(`Inputs depois: ${inputsAfter}`)
          
          if (inputsAfter > inputsBefore) {
            console.log('✅ SUCESSO! Seletor funcionou:', selector)
            
            // Digita a tarefa
            cy.get('input[type="text"]').filter(':visible').last().type('Tarefa de Teste')
            cy.get('input[type="text"]').filter(':visible').last().type('{enter}')
            
            cy.wait(1000)
            cy.get('body').then(($final) => {
              if ($final.text().includes('Tarefa de Teste')) {
                console.log('🎉 TAREFA CRIADA COM SUCESSO!')
              } else {
                console.log('⚠️ Input apareceu mas tarefa não foi salva')
              }
            })
            
          } else {
            console.log(`❌ Seletor ${selector} não funcionou`)
            elementIndex++
            tryNextElement()
          }
        })
      })
    }

    // Inicia as tentativas
    tryNextElement()
  })
})