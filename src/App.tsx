import {
  CreditCard,
  Download,
  EuroIcon,
  Phone,
  Settings,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface Contribution {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  montant: number;
}

function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [budgetInitial, setBudgetInitial] = useState(5000);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [formData, setFormData] = useState<Contribution>({
    id: '',
    nom: '',
    prenom: '',
    telephone: '',
    montant: 0,
  });

  const budgetRestant =
    budgetInitial - contributions.reduce((acc, curr) => acc + curr.montant, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.montant > budgetRestant) {
      alert('Le montant dépasse le budget restant !');
      return;
    }
    const newContribution = {
      ...formData,
      id: crypto.randomUUID(),
    };
    setContributions([newContribution, ...contributions]);
    setFormData({ id: '', nom: '', prenom: '', telephone: '', montant: 0 });
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm('Êtes-vous sûr de vouloir supprimer cette contribution ?')
    ) {
      setContributions(contributions.filter((c) => c.id !== id));
    }
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (budgetInitial <= 0) {
      alert('Le budget initial doit être supérieur à 0 !');
      return;
    }
    setIsConfigured(true);
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
      return (
        match[1] +
        ' ' +
        match[2] +
        ' ' +
        match[3] +
        ' ' +
        match[4] +
        ' ' +
        match[5]
      );
    }
    return value;
  };

  const exportToExcel = () => {
    const data = contributions.map((contribution) => ({
      Prénom: contribution.prenom,
      Nom: contribution.nom,
      Téléphone: contribution.telephone,
      'Montant (€)': contribution.montant,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contributions');
    XLSX.writeFile(wb, 'contributions.xlsx');
  };

  if (!isConfigured) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <div className='max-w-lg w-full'>
          <div className='bg-white shadow-lg rounded-xl p-8'>
            <div className='flex items-center justify-center mb-8'>
              <Settings className='h-16 w-16 text-green-600' />
            </div>
            <h2 className='text-3xl font-bold text-center text-gray-900 mb-8'>
              Configuration du Budget
            </h2>
            <form onSubmit={handleConfigSubmit} className='space-y-8'>
              <div>
                <label
                  htmlFor='budgetInitial'
                  className='block text-lg font-medium text-gray-700 mb-3'
                >
                  Budget Initial
                </label>
                <div className='relative rounded-lg shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <EuroIcon className='h-6 w-6 text-gray-400' />
                  </div>
                  <input
                    type='number'
                    id='budgetInitial'
                    required
                    min='1'
                    step='0.01'
                    placeholder='Ex: 5000.00'
                    className='block w-full pl-12 pr-20 py-4 text-xl border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors duration-200'
                    value={budgetInitial}
                    onChange={(e) =>
                      setBudgetInitial(parseFloat(e.target.value))
                    }
                  />
                  <div className='absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none'>
                    <span className='text-xl text-gray-500'>EUR</span>
                  </div>
                </div>
                <p className='mt-2 text-sm text-gray-500'>
                  Entrez le montant total du budget à gérer
                </p>
              </div>
              <button
                type='submit'
                className='w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200'
              >
                <Settings className='h-5 w-5 mr-2' />
                Configurer le Budget
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* En-tête avec le budget */}
      <div className='bg-white shadow'>
        <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Budget Collectif
            </h1>
            <div className='flex items-center justify-center gap-2 text-4xl font-bold text-green-600'>
              <EuroIcon size={32} />
              <span>{budgetRestant.toFixed(2)} €</span>
            </div>
            <p className='mt-1 text-sm text-gray-500'>
              sur {budgetInitial.toFixed(2)} €
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className='max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8'>
        <div className='bg-white shadow rounded-lg p-8'>
          <h2 className='text-2xl font-semibold mb-8'>Nouvelle Contribution</h2>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <div>
                <label
                  htmlFor='nom'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Nom
                </label>
                <div className='relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <User className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    id='nom'
                    required
                    placeholder='Ex: Dupont'
                    className='block w-full pl-10 pr-3 py-3 text-base border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor='prenom'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Prénom
                </label>
                <div className='relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <User className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    id='prenom'
                    required
                    placeholder='Ex: Jean'
                    className='block w-full pl-10 pr-3 py-3 text-base border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                    value={formData.prenom}
                    onChange={(e) =>
                      setFormData({ ...formData, prenom: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor='telephone'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Numéro de téléphone
              </label>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Phone className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='tel'
                  id='telephone'
                  required
                  placeholder='Ex: 06 12 34 56 78'
                  pattern='[0-9\s]{14}'
                  className='block w-full pl-10 pr-3 py-3 text-base border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  value={formData.telephone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setFormData({ ...formData, telephone: formatted });
                  }}
                />
              </div>
              <p className='mt-1 text-sm text-gray-500'>
                Format: 06 12 34 56 78
              </p>
            </div>
            <div>
              <label
                htmlFor='montant'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Montant (€)
              </label>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <CreditCard className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  type='number'
                  id='montant'
                  required
                  min='0'
                  step='0.01'
                  placeholder='Ex: 50.00'
                  className='block w-full pl-10 pr-12 py-3 text-base border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
                  value={formData.montant || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      montant: parseFloat(e.target.value),
                    })
                  }
                />
                <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                  <span className='text-gray-500'>EUR</span>
                </div>
              </div>
            </div>
            <div className='flex justify-end pt-4'>
              <button
                type='submit'
                className='inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                Ajouter la contribution
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Liste des contributions */}
      <div className='max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 pb-16'>
        <div className='bg-white shadow rounded-lg overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <Users className='h-5 w-5 text-gray-400' />
                <h2 className='ml-2 text-lg font-medium text-gray-900'>
                  Liste des contributions
                </h2>
              </div>
              <button
                onClick={exportToExcel}
                className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              >
                <Download className='h-4 w-4 mr-2' />
                Exporter en Excel
              </button>
            </div>
          </div>
          <div className='bg-gray-50'>
            <ul className='divide-y divide-gray-200'>
              {contributions.map((contribution) => (
                <li
                  key={contribution.id}
                  className='px-6 py-4 hover:bg-gray-100 transition-colors duration-150'
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-900'>
                        {contribution.prenom} {contribution.nom}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {contribution.telephone}
                      </p>
                    </div>
                    <div className='flex items-center gap-4'>
                      <p className='text-sm font-semibold text-green-600'>
                        {contribution.montant.toFixed(2)} €
                      </p>
                      <button
                        onClick={() => handleDelete(contribution.id)}
                        className='text-red-600 hover:text-red-800 transition-colors duration-150'
                        title='Supprimer la contribution'
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              {contributions.length === 0 && (
                <li className='px-6 py-4 text-center text-gray-500'>
                  Aucune contribution pour le moment
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
